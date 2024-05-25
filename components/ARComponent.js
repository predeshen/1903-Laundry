import React, { useState, useRef, useEffect } from 'react';
import { Button, Image, View, Text, FlatList,  
  StyleSheet,  ScrollView,   TouchableOpacity,Modal,  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import io from 'socket.io-client';
import { Camera } from 'expo-camera'; // Import Camera from react-native-camera
import { CommonStyles, Fonts, Colors } from '../theme';
import { useWindowDimensions,Alert  } from 'react-native';
import withLoadingOverlay from './withLoadingOverlay';
import { CustomAlert } from '../components/CustomAlert';


const ARComponent = () => {
  const [image, setImage] = useState(null);
  const [image_path, setImage_path] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [predictedSize, setPredictedSize] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [bust, setBust] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

    // Define the size ranges
    const sizeRanges = [
      { size: 'XXS', bustMin: 79, bustMax: 81, hipsMin: 88, hipsMax: 91, waistMin: 61, waistMax: 63 },
      { size: 'XS', bustMin: 84, bustMax: 86, hipsMin: 94, hipsMax: 96, waistMin: 66, waistMax: 68 },
      { size: 'S', bustMin: 89, bustMax: 91, hipsMin: 99, hipsMax: 101, waistMin: 71, waistMax: 73 },
      { size: 'M', bustMin: 94, bustMax: 96, hipsMin: 104, hipsMax: 106, waistMin: 76, waistMax: 78 },
      { size: 'L', bustMin: 99, bustMax: 101, hipsMin: 109, hipsMax: 111, waistMin: 81, waistMax: 83 },
      { size: 'XL', bustMin: 104, bustMax: 106, hipsMin: 114, hipsMax: 116, waistMin: 86, waistMax: 88 },
      { size: '2XL', bustMin: 109, bustMax: 111, hipsMin: 119, hipsMax: 121, waistMin: 91, waistMax: 93 },
      { size: '3XL', bustMin: 114, bustMax: 116, hipsMin: 124, hipsMax: 126, waistMin: 96, waistMax: 98 },
      { size: '4XL', bustMin: 119, bustMax: 121, hipsMin: 129, hipsMax: 131, waistMin: 101, waistMax: 103 },
      { size: '5XL', bustMin: 123, bustMax: 126, hipsMin: 134, hipsMax: 136, waistMin: 106, waistMax: 108 },
      { size: '6XL', bustMin: 129, bustMax: 132, hipsMin: 139, hipsMax: 141, waistMin: 111, waistMax: 113 },
      { size: '7XL', bustMin: 135, bustMax: 138, hipsMin: 144, hipsMax: 146, waistMin: 116, waistMax: 118 },
    ];
  
  // Other state variables and functions
  const handleCloseAlert = ()=> {
    setShowAlert(false);
    setIsLoading(false);
  };
 
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };
  const disabledButtonStyle = {
    backgroundColor: 'gray', // Change the background color to gray
    opacity: 0.6, // Reduce the opacity to make it look disabled
  };

  const handleDetection = async (image_pathz) => {    
   // console.log('handle detection');
    try {
      const response = await axios.post('http://52.200.101.253:8000/detect_pose_landmarks', {
        "image_path": image_pathz,
      });
      //console.log(response);
      if (!response.data.error) {
        const result = response.data;
        const landmarks = result.landmarks;
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];
        const centerBody = landmarks[26];
  
        const bustInCentimeters = (Math.sqrt(
          (rightShoulder.x - leftShoulder.x) ** 2 +
          (rightShoulder.y - leftShoulder.y) ** 2 +
          (rightShoulder.z - leftShoulder.z) ** 2
        ) * 100) + 20.33;
  
        const hipsInCentimeters = (Math.sqrt(
          (rightHip.x - leftHip.x) ** 2 +
          (rightHip.y - leftHip.y) ** 2 +
          (rightHip.z - leftHip.z) ** 2
        ) * 100) + 20.33;
  
        const waistInCentimeters = (Math.sqrt(
          (centerBody.x - leftShoulder.x) ** 2 +
          (centerBody.y - leftShoulder.y) ** 2 +
          (centerBody.z - leftShoulder.z) ** 2
        ) * 100) + 20.33;
  
        // Predict size
        predictSize(bustInCentimeters, hipsInCentimeters, waistInCentimeters);
        setWaist(waistInCentimeters.toFixed(2));
        setHips(hipsInCentimeters.toFixed(2));
        setBust(bustInCentimeters.toFixed(2));
        openModal();
        setIsLoading(false);
      } else {
        console.error('Error:', response.data.error);
      }
    } catch (error) {
      console.error('Error in image detection:', error);
    }
  };
  
  // Function to predict size based on measurements
  function predictSize(bust, hips, waist) {
    // Iterate through size ranges to find the predicted size
    for (const range of sizeRanges) {
      if (
        bust >= range.bustMin && bust <= range.bustMax &&
        hips >= range.hipsMin && hips <= range.hipsMax &&
        waist >= range.waistMin && waist <= range.waistMax
      ) {
        setPredictedSize(range.size);
        return range.size;
      }
    }
    setPredictedSize('unable to predict size');
    return 'Size not found';
  }
  

  const uploadImage = async () => {
    try {
      if (!image) {
        console.error("Please select an image to upload.");
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      const response = await axios.post('http://52.200.101.253:8000/upload_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.data.image_url;
      setImage_path(result);
      //console.log('Image uploaded:', response.data.image_url);
      if (result) {
        await new Promise((resolve) => {
          try {
            handleDetection(result);
            resolve();
          } catch (error) {
            console.error('Error in image detection:',error);
            setShowAlert(true);
          }
        });
      }
      else{
        setAlertMessage('Error in image upload:',response);
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage("Error in image upload:", error);
      setShowAlert(true);
    }
  };

    return (
      <ScrollView 
      style={styles.scrollView}
      >
      <View style={styles.container}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('../assets/laugh.png')} style={{ width: 200, height: 200 }} />
      <Text>Upload an image with visible shoulders, hip outlines, and waist.</Text>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      }

      <TouchableOpacity
       style={[CommonStyles.button, styles.ButtonSpacing]}
       onPress={pickImage}
      >
  <Text style={[CommonStyles.buttonTextNormal]}>Open Media Library</Text>
</TouchableOpacity>

<TouchableOpacity
  style={[CommonStyles.button, styles.ButtonSpacing, image ? null : disabledButtonStyle]}
  onPress={uploadImage}
  disabled={!image}
>
         {isLoading ? (
            <ActivityIndicator color={Colors.body} />
          ) : (
            <Text style={[CommonStyles.buttonTextNormal]}>Estimate Size</Text>
            )}
  </TouchableOpacity>

    </View>
    </View>
    <View     style={styles.modalContainer}>
    <Modal visible={isModalVisible} transparent animationType="slide">
    <View style={styles.modalContentContainer}>
    <ScrollView contentContainerStyle={styles.modalContentContainer}>
      <Text style={styles.modalTitle}>Estimated Measurements:</Text>
      <Text>
      <Text style={[styles.modalContentText, {fontWeight: 'bold'}]}>Bust: </Text>
      <Text style={styles.modalContentNumbers}>{bust}</Text>
      </Text>
      <Text>
      <Text style={[styles.modalContentText, {fontWeight: 'bold'}]}>Hips: </Text> 
      <Text style={styles.modalContentNumbers}>{hips}</Text>
      </Text>
      <Text>
      <Text style={[styles.modalContentText,{fontWeight: 'bold'}]}>Waist: </Text> 
      <Text style={styles.modalContentNumbers}>{waist}</Text>
      </Text>
      <Text>
      <Text style={[styles.modalContentText,{fontWeight: 'bold'}]}>Predicted Size: </Text>
      <Text style={styles.modalContentNumbers}>{predictedSize}</Text>
      </Text>
      <Text>
      <Text style={[styles.modalContentText,{fontWeight: 'bold'}]}>Terms and Conditions:  </Text>
      <Text style={styles.modalContentText}>Size estimation may not be 100% accurate; please double-check with reference to the size guide below</Text>
      </Text>
      <Text style={[styles.modalContentText,{fontWeight: 'bold'}]}>Size Table (cm):</Text>
      {/* {sizeRanges.map((range) => (
        <Text key={range.size}>
          {range.size}: Bust {range.bustMin} - {range.bustMax}, Hips {range.hipsMin} - {range.hipsMax}, Waist {range.waistMin} - {range.waistMax}
        </Text>
      ))} */}
      <Image source={require('../assets/sizeguide.png')} style={{ width: 200, height: 200 }} />
      <Button title="Close" onPress={closeModal} style={[styles.modalButton, styles.modalButtonText]} />
    </ScrollView>
    </View>
    </Modal>
    </View>
    <CustomAlert
                  isVisible={showAlert}
                  onClose={handleCloseAlert}
                  message={alertMessage}
        />
   </ScrollView>
    
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 25
  },
  scrollView: {
    marginBottom: 85,
  },
  ButtonSpacing: {
    marginTop: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    backgroundColor: 'rgba(250, 235, 215, 0.98)',
    alignItems: 'center',
    borderRadius: 10,
    padding:5,
    width: 400,
    height: 600,
    marginTop: 50,
    marginLeft: 6,
    fontSize: 20,
  },
  modalContentText: {
    alignItems: 'center',
    fontSize: 20,
  },
  modalContentNumbers: {
    fontSize: 20,
    color: Colors.primary,
  },
  modalTitle:{
    ...CommonStyles.headerText,
    fontSize: 35,
  },
  modalImage: {
    flex: 1,
    height: 500, 
    width:'100%',
  },
  modalHeader: {
    ...CommonStyles.headerText,
    fontSize: 24,
    color: Colors.primary, // Header text color
    marginVertical: 10,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Colors.primary, // Button background color
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    ...CommonStyles.button,
    ...CommonStyles.buttonTextNormal,
    fontSize: 18, // Increase the font size as needed
    textAlign: 'center',
  },
  pickerLabel: {
    ...CommonStyles.headerText,
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.primary,
  },
  modalSaveButton: {
    backgroundColor: Colors.background, // Button background color for Save button
    ...CommonStyles.buttonTextNormal,
  },
});

export default withLoadingOverlay(ARComponent);