import * as React from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import fireDb from '../firebasedb';

export default function UploadImage() {

    const [image, setImage] = React.useState();
    
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
    },[])

    const pickImage = async () => {
      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.cancelled) {
          setImage(result.uri)
        }
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    };

    const uploadImage = async() => {
      try {
        if (image) {
          await fireDb.uploadImage(image, Math.random() * 100000);
        } else {
          alert('No image selected');
        }
      } catch (err) {
        alert(err);
      }
    }

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
        <Button title="Pick an image" onPress={pickImage} />
        <Button title="Upload" onPress={uploadImage} />
      </View>
    );
}
