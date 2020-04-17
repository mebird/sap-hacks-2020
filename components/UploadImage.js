import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { useStoreActions } from 'easy-peasy';
import { fireDb } from '../firebasedb'

export default function UploadImage(props) {
  const setUri = useStoreActions(s => s.setImageUri);

  React.useEffect(() => {
    const getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    };
    getPermissionAsync();
  }, [])

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setUri(result.uri);
        fireDb.uploadImage(result.uri);
      }
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
      <TouchableOpacity style={props.style} onPress={() => pickImage()}>
        <Text style={styles.btnText}>
          Pick an image
        </Text>
      </TouchableOpacity>
  );

}

const styles = StyleSheet.create({
  btnText: {
      color: 'white',
  },
  longButton: {
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#2B3158',
    alignItems: 'center'
  },
})
