import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  UIManager,
  Platform,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../utils/color';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type Id = string | number;
export type TreeNode = {
  id: Id;
  label: string;
  children?: TreeNode[];
  lazy?: boolean;
  meta?: Record<string, any>;
};

export type CustomTreeViewProps = {
  data: TreeNode[];
  initiallyOpen?: Id[];
  indent?: number;
  query?: string;
  match?: (node: TreeNode, q: string) => boolean;
  autoExpandOnSearch?: boolean;
  customStyle?: ViewStyle;
  renderLabel?: (
    node: TreeNode,
    s: {
      isOpen: boolean;
      hasChildren: boolean;
      depth: number;
      isMatch: boolean;
    },
  ) => React.ReactNode;
  onSelect?: (node: TreeNode) => void;
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>;
  multiselect?: boolean;
  selectedIds?: Set<Id>;
  onChangeSelected?: (ids: Set<Id>) => void;
};

export default function CustomTreeView({
  data,
  initiallyOpen = [],
  indent = 14,
  query = '',
  match,
  autoExpandOnSearch = true,
  renderLabel,
  customStyle,
  onSelect,
  loadChildren,
  multiselect = false,
  selectedIds,
  onChangeSelected,
}: CustomTreeViewProps) {
  const [open, setOpen] = useState<Set<Id>>(new Set(initiallyOpen));
  const [loading, setLoading] = useState<Set<Id>>(new Set());
  const [internalSelected, setInternalSelected] = useState<Set<Id>>(new Set());
  const sel = selectedIds ?? internalSelected;
  const setSel = (up: (prev: Set<Id>) => Set<Id>) => {
    const next = up(sel);
    if (!selectedIds) setInternalSelected(next);
    onChangeSelected?.(next);
  };

  const matcher = useMemo(
    () =>
      match ??
      ((n: TreeNode, q: string) =>
        n.label.toLowerCase().includes(q.toLowerCase())),
    [match],
  );

  const allNodes = useMemo(() => flatten(data), [data]);

  const hitIds = useMemo(() => {
    if (!query.trim()) return new Set<Id>();
    const s = new Set<Id>();
    allNodes.forEach(n => {
      if (matcher(n, query)) s.add(n.id);
    });
    return s;
  }, [allNodes, query, matcher]);

  useEffect(() => {
    if (!autoExpandOnSearch || !query.trim()) return;
    const e = new Set(open);
    hitIds.forEach(id => {
      const path = findPath(data, id);
      if (path) path.forEach(n => e.add(n.id));
    });
    LayoutAnimation.easeInEaseOut();
    setOpen(e);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = async (node: TreeNode) => {
    const willOpen = !open.has(node.id);
    if (
      willOpen &&
      node.lazy &&
      (!node.children || node.children.length === 0) &&
      loadChildren
    ) {
      if (!loading.has(node.id)) {
        setLoading(s => new Set(s).add(node.id));
        try {
          const children = await loadChildren(node);
          node.children = children;
          node.lazy = false;
        } finally {
          setLoading(s => {
            const nx = new Set(s);
            nx.delete(node.id);
            return nx;
          });
        }
      }
    }
    LayoutAnimation.easeInEaseOut();
    setOpen(s => {
      const nx = new Set(s);
      if (nx.has(node.id)) nx.delete(node.id);
      else nx.add(node.id);
      return nx;
    });
  };

  const toggleSelect = (node: TreeNode) => {
    setSel(s => {
      const nx = new Set(s);
      if (nx.has(node.id)) nx.delete(node.id);
      else nx.add(node.id);
      return nx;
    });
  };

  const Row = ({ node, depth }: { node: TreeNode; depth: number }) => {
    const hasChildren =
      !!(node.children && node.children.length) || !!node.lazy;
    const isOpen = open.has(node.id);
    const isMatch = hitIds.has(node.id);
    const isLoading = loading.has(node.id);

    const label = renderLabel ? (
      renderLabel(node, { isOpen, hasChildren, depth, isMatch })
    ) : (
      <Text
        style={[styles.label, isMatch && styles.labelHit]}
        numberOfLines={1}
      >
        {node.label}
      </Text>
    );

    return (
      <View>
        <Pressable
          onPress={() => (hasChildren ? toggle(node) : onSelect?.(node))}
          onLongPress={() => multiselect && toggleSelect(node)}
          style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        >
          {multiselect && (
            <Pressable
              onPress={() => toggleSelect(node)}
              style={styles.cbBox}
              hitSlop={6}
            >
              <Text style={styles.cbTxt}>{sel.has(node.id) ? '☑' : '☐'}</Text>
            </Pressable>
          )}
          <Text style={[styles.chev, { marginLeft: depth * indent }]}>
            {hasChildren ? (isLoading ? '…' : isOpen ? '▼' : '▶') : '•'}
          </Text>
          <View style={styles.labelWrap}>{label}</View>
        </Pressable>

        {hasChildren && isOpen && node.children && (
          <View>
            {node.children.map(c => (
              <Row key={c.id} node={c} depth={depth + 1} />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, customStyle]}
      contentContainerStyle={{ paddingVertical: 4 }}
    >
      {data.map(n => (
        <Row key={n.id} node={n} depth={0} />
      ))}
      {loading && (
        <View style={{ paddingVertical: 24 }}>
          <ActivityIndicator />
        </View>
      )}
    </ScrollView>
  );
}

// helpers: dùng for-index để tránh downlevelIteration
function flatten(nodes: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (arr: TreeNode[]) => {
    for (let i = 0; i < arr.length; i++) {
      const n = arr[i];
      out.push(n);
      if (n.children && n.children.length) walk(n.children);
    }
  };
  walk(nodes);
  return out;
}

function findPath(nodes: TreeNode[], id: Id): TreeNode[] | null {
  const path: TreeNode[] = [];
  const dfs = (arr: TreeNode[]): boolean => {
    for (let i = 0; i < arr.length; i++) {
      const n = arr[i];
      path.push(n);
      if (n.id === id) return true;
      if (n.children && n.children.length && dfs(n.children)) return true;
      path.pop();
    }
    return false;
  };
  return dfs(nodes) ? [...path] : null;
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.Gray,
    borderRadius: border.radiusMedium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: border.radiusMedium,
  },
  rowPressed: { backgroundColor: '#F8FAFC' },
  chev: { width: 16, textAlign: 'center', color: '#64748B' },
  labelWrap: { marginLeft: 8, flexShrink: 1, flex: 1 },
  label: { fontSize: 14, color: '#0F172A', fontWeight: '600' },
  labelHit: {
    backgroundColor: '#FEF9C3',
    paddingHorizontal: 4,
    borderRadius: border.radiusSmall,
  },
  cbBox: { marginRight: 6 },
  cbTxt: { fontSize: 16 },
});

// map từ payload backend (có thể dùng 'childrent')
export type OrgPayload = {
  id: Id;
  orgStructName: string;
  orgStructCode: string;
  children?: OrgPayload[];
  childrent?: OrgPayload[];
};
export const mapOrgToTree = (nodes: OrgPayload[] = []): TreeNode[] =>
  nodes.map(n => ({
    id: n.id,
    label: `${n.orgStructName} (${n.orgStructCode})`,
    children: mapOrgToTree(n.children ?? n.childrent ?? []),
  }));
