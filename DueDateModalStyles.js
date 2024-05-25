import { StyleSheet } from 'react-native';

const DueDateModalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  dueDatePrompt: {
    width: '100%',
  },
  dueDatePromptText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  outlineImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalImage: {
    width: 150,
    height: 150,
  },
  dueDateInput: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
});

export default DueDateModalStyles;
