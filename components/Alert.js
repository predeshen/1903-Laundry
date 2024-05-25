// components/Alert.js

import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

const Alert = ({ showAlert, alertMessage, handleCloseAlert }) => {
  return (
    <Modal
      visible={showAlert}
      animationType="slide"
      transparent={true}
    >
      <View>
        <View>
          <Text>{alertMessage}</Text>
          <TouchableOpacity onPress={handleCloseAlert}>
            <Text>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Alert;
