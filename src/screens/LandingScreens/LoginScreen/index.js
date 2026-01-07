import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Surface, Text, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { useApiCall, useAuthToken } from '../../../hooks';
import { setAccessToken, setUserData, setWalletVisible } from '../../../redux/reducer/User';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const { ApiCall, ApiEndpoints, ApiMethod } = useApiCall();
  const { setAuthToken, saveUserToken } = useAuthToken();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      // No CSRF cookie needed for token-based auth
      const response = await ApiCall({
        apiEndpoint: ApiEndpoints().LOGIN,
        method: ApiMethod.POST,
        apiData: { username, password },
      });

      console.log('[response]', response.data);

      // Assuming API returns { access_token, user } from Laravel Sanctum
      const { access_token, user } = response.data;

      if (access_token) {
        // Store token in AsyncStorage
        await setAuthToken(response.data);
        await saveUserToken(access_token);

        const userDataResponse = await ApiCall({
          apiEndpoint: ApiEndpoints().USER_DATA + user.member_account,
          method: ApiMethod.GET,
          apiAccessToken: access_token,
        });

        // Update Redux state
        dispatch(setAccessToken(access_token));
        dispatch(setUserData(userDataResponse?.data));
        dispatch(setWalletVisible(userDataResponse?.data?.device_wallet_show));

        console.log('[userDataResponse]', userDataResponse?.data);

        // Navigation will happen automatically via RootStackNavigation
        // when userData is set in Redux state
      } else {
        Alert.alert('Login Failed', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error?.response?.data?.message || error?.message || 'Unable to login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Image 
            source={require('../../../assets/images/fuse_logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text variant="titleLarge" style={styles.title}>Login to your account</Text>
        </View>

        <Surface style={styles.formContainer} elevation={1}>
          <View style={styles.form}>
            <TextInput
              label="Username/Email/Phone"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              disabled={loading}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#C8000D"
              outlineColor="#C8000D"
              textColor="#C8000D"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              disabled={loading}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#C8000D"
              outlineColor="#C8000D"
              textColor="#C8000D"
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color="#C8000D"
                />
              }
            />
            <Text style={{color: '#C8000D', marginLeft: 5}} onPress={() => Alert.alert('Forgot password?', 'Please contact the administrator to reset your password.')}>Forgot password?</Text>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Sign In
            </Button>
          </View>
          
          <Text style={{color: '#aaa', textAlign: 'center', marginTop: 10, marginBottom: 0}}>-- OR --</Text>

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.newButton}
            contentStyle={{paddingVertical: 0}}
          >
            Create a new account
          </Button>
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    marginTop: 50,
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    paddingTop: 0,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: 0,
    marginTop: 0,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 0,
  },
  subtitle: {
    opacity: 0.7,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  button: {
    color: '#fff',
    backgroundColor: '#C8000D',
    marginTop: 8,
  },
  newButton: {
    color: '#fff',
    backgroundColor: '#E6A23D',
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 0,
  },
});

