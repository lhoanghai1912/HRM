/**
 * Tách chuỗi thành mảng dựa trên ký tự phân tách
 * @param inputString - Chuỗi cần tách
 * @param separator - Ký tự phân tách (mặc định là ',')
 * @param trimWhitespace - Có loại bỏ khoảng trắng hay không (mặc định là true)
 * @returns Mảng các chuỗi con
 */
export const splitString = (
  inputString: string,
  separator: string = ',',
  trimWhitespace: boolean = true,
): string[] => {
  if (!inputString || typeof inputString !== 'string') {
    return [];
  }

  const result = inputString.split(separator);

  if (trimWhitespace) {
    return result.map(item => item.trim()).filter(item => item.length > 0);
  }

  return result;
};

/**
 * Ghép mảng chuỗi thành một chuỗi với ký tự phân tách
 * @param stringArray - Mảng chuỗi cần ghép
 * @param separator - Ký tự phân tách (mặc định là ', ')
 * @param filterEmpty - Có lọc bỏ chuỗi rỗng hay không (mặc định là true)
 * @returns Chuỗi đã ghép
 */
export const joinString = (
  stringArray: string[],
  separator: string = ', ',
  filterEmpty: boolean = true,
): string => {
  if (!Array.isArray(stringArray)) {
    return '';
  }

  let processedArray = stringArray;

  if (filterEmpty) {
    processedArray = stringArray.filter(
      item => item && typeof item === 'string' && item.trim().length > 0,
    );
  }

  return processedArray.join(separator);
};
