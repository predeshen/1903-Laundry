// themes.js

export const Colors = {
    primary: '#DD3333',
    secondary: 'antiquewhite',
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
      color: Colors.secondary,
      fontSize: 24,
      fontFamily:Fonts.header,
      fontWeight: 'bold',
      },
      buttonTextNormal: {
        color: Colors.secondary,
        fontSize: 24,
        fontWeight: 'bold',
        },
        buttonTextRed: {
          color: Colors.primary,
          fontSize: 18,
          fontFamily:Fonts.header,
          fontWeight: 'bold',
          },
    // Add more common styles as needed
  };
  