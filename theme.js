// themes.js

export const Colors = {
    primary: '#B4B4B4',
    background: '#1C242A',
    body: '#E4C4BC',
    border: '#84DCBC'
    // Add more colors as needed
  };
  
  export const Fonts = {
    header: 'tuesday-night',
    body:'Segoe UI',
    // Add more font styles as needed
  };
  
  export const CommonStyles = {
    container: {
      flex: 1,
      backgroundColor: 'white',
    },
    headerText: {
      fontFamily: Fonts.header,
      fontSize: 45,
      color: Colors.primary,
      textAlign: 'center',
      paddingTop: 20,
      // Add more common text styles
    },
    bodyText: {
      fontFamily: Fonts.body,
      fontSize: 45,
      color: Colors.primary,
      textAlign: 'center',
      paddingTop: 20,
      // Add more common text styles
    },
    button: {
      backgroundColor: Colors.primary,
      borderRadius: 2,
      paddingVertical: 12,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    buttonText: {
      color: Colors.body,
      fontSize: 14,
      fontFamily:Fonts.header,
      fontWeight: 'bold',
      },
      buttonTextNormal: {
        color: Colors.body,
        fontSize: 14,
        fontWeight: 'bold',
        },
        buttonTextRed: {
          color: Colors.body,
          fontSize: 12,
          fontFamily:Fonts.header,
          fontWeight: 'bold',
          },
    // Add more common styles as needed
  };
  