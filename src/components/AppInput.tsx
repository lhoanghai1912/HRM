import React, { useState } from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TextInputProps,
  StyleProp,
  TextStyle,
  Image,
  TouchableOpacity,
  ImageStyle,
} from 'react-native';
import AppStyles from './AppStyle';
import icons from '../assets/icons';
import { ms, spacing } from '../utils/spacing';
import { ImageSourcePropType } from 'react-native';
import { border, fonts } from '../utils/fontSize';
import { useColors } from '../hooks/useColors';

interface AppInputProps extends TextInputProps {
  leftIcon?: ImageSourcePropType;
  rightIcon?: ImageSourcePropType;
  rightPress?: () => void;
  label?: string;
  error?: string;
  style?: StyleProp<TextStyle>;
  clearStyle?: ImageStyle;
}

const AppInput: React.FC<AppInputProps> = ({
  leftIcon,
  rightIcon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  style,
  label,
  error,
  clearStyle,
  editable = true,
  rightPress,
  ...props
}) => {
  const colors = useColors();
  const [isShow, setIsShow] = useState(false);
  const handleShowHide = async () => {
    setIsShow(!isShow);
  };
  const handleClear = async () => {
    onChangeText?.('');
  };
  return (
    <View style={styles.wrapper}>
      {label && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <View
        style={[
          styles.input,
          { borderColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[AppStyles.icon, { marginRight: spacing.small }]}
            resizeMode="contain"
          />
        )}
        <TextInput
          editable={editable}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isShow}
          keyboardType={keyboardType}
          style={[
            style,
            error && { borderColor: colors.error },
            {
              fontSize: fonts.normal,
              flex: 1,
              marginRight: spacing.small,
              color: colors.text,
            },
          ]}
          placeholderTextColor={colors.textTertiary}
          {...props}
        />
        {editable && (
          <>
            {secureTextEntry ? (
              <View style={AppStyles.iconGroup}>
                <TouchableOpacity onPress={handleShowHide}>
                  <Image
                    source={isShow ? icons.show_pass : icons.hide}
                    style={[
                      AppStyles.icon,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleClear}>
                  <Image
                    source={icons.clear}
                    style={[
                      AppStyles.icon,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  ></Image>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={AppStyles.iconSingle}>
                <TouchableOpacity onPress={handleClear}>
                  <Image
                    source={icons.clear}
                    style={[
                      AppStyles.icon,
                      clearStyle,
                      { display: value ? 'flex' : 'none' },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.medium,
    width: '100%',
  },
  label: {
    fontSize: fonts.normal,
    marginBottom: spacing.small,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: border.radiusLarge,
    paddingHorizontal: spacing.medium,
    fontSize: fonts.normal,
    borderWidth: 0.5,
  },
  errorText: {
    color: '#ff5a5f',
    fontSize: fonts.small,
    marginTop: ms(8),
  },
});

export default AppInput;
