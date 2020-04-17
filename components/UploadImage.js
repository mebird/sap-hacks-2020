import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { useStoreActions } from 'easy-peasy';

export default function UploadImage() {
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
      }
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.longButton} onPress={() => pickImage()}>
        <Text style={styles.btnText}>
          Pick an image
        </Text>
      </TouchableOpacity>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  longButton: {
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#2B3158',
    width: '90%',
    alignItems: 'center'
  },
  btnText: {
      color: 'white',
  }
})
