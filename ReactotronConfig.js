import Reactotron from 'reactotron-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: 'HRM App',
    host: '10.0.2.2', // For Android Emulator, use your PC IP for real device
  })
  .useReactNative({
    asyncStorage: true, // Enable AsyncStorage monitoring
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: { veto: stackFrame => false },
    overlay: false,
  })
  .use(reactotronRedux()) // Redux plugin
  .connect();

export default reactotron;
