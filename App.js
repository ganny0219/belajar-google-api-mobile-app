import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GDrive,
  MimeTypes,
} from '@robinbobin/react-native-google-drive-api-wrapper';

const App = () => {
  const [token, setToken] = useState();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: [
        'https://www.googleapis.com/auth/cloud-platform.read-only',
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
      webClientId:
        '206085933109-tccfakor0a2tnbdhh78j2a09n1ktnt3f.apps.googleusercontent.com',
      offlineAccess: true,
    });
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) setToken(token);
    };
    getToken();
  }, []);
  const signGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signIn();
      const accessToken = (await GoogleSignin.getTokens()).accessToken;
      await AsyncStorage.setItem('token', accessToken);
      setToken(accessToken);
    } catch (error) {
      console.log(error.message);
    }
  };
  const getGdriveList = async () => {
    try {
      const gdrive = new GDrive();
      gdrive.accessToken = token;
      console.log(await gdrive.files.list());
    } catch (error) {
      console.log(error.message);
    }
  };
  const logOut = async () => {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
  };
  return (
    <View style={styles.container}>
      <Button title="sign google" onPress={signGoogle} />
      <Button title="log out" onPress={logOut} />
      <Button title="get gdrive list" onPress={getGdriveList} />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
