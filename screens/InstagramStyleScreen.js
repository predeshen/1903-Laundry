import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  ActivityIndicator,
  TextInput,
  Dimensions,
  NativeModules,
  SafeAreaView
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import BottomMenu from '../components/BottomMenu';
import TopBarC from '../components/TopBar';
import HTML from 'react-native-render-html';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ModalDropdown from 'react-native-modal-dropdown';
import withLoadingOverlay from '../components/withLoadingOverlay';
import { FAB } from 'react-native-paper';
import RefreshButton from '../components/RefreshButton';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { CommonStyles, Fonts, Colors } from '../theme';
import { useWindowDimensions, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import {
  getCustomer,
  getProductVariationsv2,
  addToCart,
  updateCustomerMetaData,
  getParentCategories,
  getLatestProductsv2,
  getLatestProductsv3,
  fetchCartItems,
  getCartItems,
  getCartItems2,
  getProductReviews,
  getProductImage
} from '../services/apiMainEntry';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { CustomAlert } from '../components/CustomAlert';
import { Checkbox } from 'react-native-paper';
import DueDateModalStyles from '../DueDateModalStyles';
import { Image } from 'expo-image';
import { WebView } from 'react-native-webview';

const TopBar = ({ countdown }) => {
  return (
    <TopBarC text={countdown} />
  );
};

const InstagramFeedScreen = ({ navigation, startLoading, stopLoading}) => {
  // State management
  const [isTfReady, setIsTfReady] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [latestProducts, setLatestProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { width } = useWindowDimensions();
  const [showAlert, setShowAlert] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]); // State to hold products
  const [page, setPage] = useState(1);
  LocaleConfig.defaultLocale = 'en';
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [ParentCategories, setParentCategories] = useState([]);
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showDueDatePrompt, setShowDueDatePrompt] = useState(false);
  const [isPushTokenAvailable, setisPushTokenAvailable] = useState(false);
  const isFocused = useIsFocused();
  const [dueDate, setDueDate] = useState('');
  const [customer, setCustomer] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [cart, setCart] = useState([]);
  const [availableVariations, setAvailableVariations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isVariationModalVisible, setIsVariationModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const remainingImagesToLoad = useRef(0);
  const [areAllImagesLoaded, setAreAllImagesLoaded] = useState(false);
  const [initialProducts, setInitialProducts] = useState([]); // State to hold initial products
  const [hasMore, setHasMore] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  const [showCartWidget, setShowCartWidget] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const currentDate = new Date();
  const currentDateAsString = currentDate.toString();
  const pageSize = 7; // Adjust this based on your preference
  const maxProducts = 500; // Maximum number of products to load
  const refreshInterval = 10000; // For example, refresh every 60 seconds
  const [isLoadingVariations, setIsLoadingVariations] = useState(false);
  const [image, setImage] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [isShowReviewModal , setIsShowReviewModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const webViewRef = useRef(null);

  // useEffect for initial setup
  useEffect(() => {
    startLoading();
    fetchCustomer();
    if (customer != null) {
      fetchCustomerToken();
      schedulePushNotification();
    }
    fetchCartItems();
    updateCartCount();
    fetchData(currentPage);
    fetchParentCategories();
    const unsubscribe = navigation.addListener('focus', () => {
      updateCartCount();
    });
    return () => {
      unsubscribe();
      updateCartCount();
      fetchCustomer();
      fetchCartItems();
      fetchParentCategories();
    };
  }, [navigation, cart, countdown]);


  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
    } else {
      alert('Must use a physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    await SecureStore.setItemAsync('expoPushToken', `${token}`);

    return token;
  }

  async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Hello ${customer.name}`,
        body: `${21} Days left till the big day !!!`,
      },
      trigger: { day: 1 },
    });
  }

  // Use Image for image loading
  const handleImageLoad = () => {
    remainingImagesToLoad.current++;
    if (remainingImagesToLoad.current === 1) {
      stopLoading();
    }
  };

  const injectedJavaScript = `
  (function() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode('.mkdf-mobile-header { display: none !important; }'));
    style.appendChild(document.createTextNode('.mkdf-page-footer { display: none !important; }'));
    style.appendChild(document.createTextNode('.mkdf-content    { background-color: #1C242A !important; ; }'));
    style.appendChild(document.createTextNode('.mkdf-title-holder.mkdf-standard-type.mkdf-title-va-header-bottom { display: none;}'));
    style.appendChild(document.createTextNode('p.order-again {display: none;}'));
    style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--downloads {display: none;}'));
    style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--edit-account {display: none; }'));
    style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--contributions { display: none;}'));
    style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--customer-logout { display: none;}'));
    style.appendChild(document.createTextNode('li.woocommerce-MyAccount-navigation-link.woocommerce-MyAccount-navigation-link--dashboard {display: none;}'));
    style.appendChild(document.createTextNode('nav.woocommerce-MyAccount-navigation { background-color: #1C242A !important; ; }'));
    style.appendChild(document.createTextNode('p.order-again {display: none;}'));
    style.appendChild(document.createTextNode('.mkdf-container-inner.clearfix {padding: 0px !important;}'));
    style.appendChild(document.createTextNode('div#ht-ctc-chat {display: none;}'));
    document.head.appendChild(style);   
  })();
`;

  const onPageLoad = () => {
    webViewRef.current.injectJavaScript(injectedJavaScript);
};

  // Implement infinite scrolling with a loading indicator
  const loadMoreProducts = () => {
    setIsLoading(true);
    if (hasMore) {
      setPage(currentPage + 1);
      setLoadMore(true);
      fetchData(currentPage);
    }
  };

  const closeVariationModal = () => {
    setIsVariationModalVisible(false);
  };

  
  const closeReviewModal = () => {
    setIsShowReviewModal(false);
    setIsLoading(false);
  };
  // Function to update the cart count
  const updateCartCount = async () => {

    const fetchedCartItems = await fetchCartItems();
    if (Array.isArray(fetchedCartItems)) {
      const cartCount = fetchedCartItems.length;
      setCartCount(cartCount);
    }
    else{
      setCartCount(0);
    }
  };

  // Function to fetch data
  const fetchData = async (currentPage) => {
    try {
      setIsLoading(true);
      let products = [];
      if (hasMore) {
        products = await getLatestProductsv2(currentPage, pageSize);
      }
      if (await products.length > 0) {
        setLatestProducts((latestProducts) => [...latestProducts, ...products]);
        setCurrentPage(currentPage + 1);
        if (latestProducts.length >= maxProducts) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return;

    } finally {
      setIsLoading(false);
    }
  };
  
  LocaleConfig.locales['en'] = {
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.'],
  };
  
  const fetchCustomer = async () => {
    try {
      const response = await getCustomer();
      
      setCustomer(await response[0]);
      const hasExpectedDueDate = await response[0].meta_data.some(item => item.key === 'expected_due_date');
      if (hasExpectedDueDate) {
        const expectedDueDateItem = await response[0].meta_data.find(item => item.key === 'expected_due_date');
        const dueDateValue = expectedDueDateItem.value;
        setDueDate(dueDateValue);
        const now = new Date(currentDate);
        const due = new Date(dueDateValue);
        const differenceInMs = due - now;
        const daysUntilDue = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));
        await SecureStore.setItemAsync('countdown', daysUntilDue.toString());
        setCountdown(daysUntilDue); 
      } else {
        setShowDueDatePrompt(true);
      }

    } catch (error) {
      console.error(error);
      return;

    }
  };

  const fetchCustomerToken = async () =>{
    let existingToken
    const hasPushToken = await customer.meta_data.some(item => {
      if (item.key === 'push_token') {
        existingToken = item.value;
        return true;
      }
      return false;
    });

    let token;
    token = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig.extra.eas.projectId,
    });


    if (existingToken === token) {
    // setAlertMessage(`existing meta token equals device token: ${existingToken}`);
    // setShowAlert(true);
    }  
    else {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        const expotoken = await SecureStore.getItemAsync('expoPushToken');

        const updatedMetaData2 = customer.meta_data.concat({
          key: 'push_token',
          value: expotoken,
        });

        await updateCustomerMetaData(customer.id, updatedMetaData2);
       // setAlertMessage(`updated meta existing push token: ${expotoken}`);
       // setShowAlert(true);
    }
  }

  const fetchProductVariations = async (productId) => {
    try {
      setSelectedProductId(productId);
      setIsLoadingVariations(true); // Set loading state to true
      const response = await getProductVariationsv2(productId);
      const availableVariations = response.filter(
        (variation) => variation.stock_status === 'instock'
      );
      setAvailableVariations(response);
    } catch (error) {
      console.error('Error fetching variations:', error);
      setAvailableVariations([]);
      return;

    } finally {
      setIsLoadingVariations(false); // Set loading state to false when loading is complete
    }
  };

  const openVariationModal = (product) => {
    setIsVariationModalVisible(true);
    setSelectedProduct(product);
    setSelectedVariation(null);
    fetchProductVariations(product.id);
  };

  // Function to toggle the selection of a category
  const toggleCategorySelection = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };
  
  const applyCategoryFilters = async () => {
    setIsLoading(true);
    const filteredProducts = await getLatestProductsv3(selectedCategories);
    setLatestProducts(filteredProducts);
    setIsCategoryModalVisible(false);
    setIsLoading(false);
  };

  // Function to apply category filters and close the modal
  const clearCategoryFilters = async () => {
    // Update the latestProducts state with the filtered products.
    setIsLoading(true);
    const filteredProducts = await getLatestProductsv2(1,25);
    setLatestProducts(filteredProducts);
    setIsCategoryModalVisible(false);
    setIsLoading(false);
  };

  const clearVariationModal = () => {
    setSelectedProduct(null);
    setIsVariationModalVisible(false);
    setIsLoading(false);
  }

    // Function to render a checkbox for each category
    const renderCategoryCheckboxes = () => {
      return ParentCategories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => toggleCategorySelection(category.id)}
          style={styles.categoryCheckboxContainer}
        >
          <Checkbox
            status={
              selectedCategories.includes(category.id) ? 'checked' : 'unchecked'
            }
            onPress={() => toggleCategorySelection(category.id)}
            color={Colors.primary}
          />
          <Text>{category.name}</Text>
        </TouchableOpacity>
      ));
    };
      
  const fetchParentCategories = async () => {
    try {
      const categories = await getParentCategories();
      setParentCategories(categories);
    } catch (error) {
      console.error('Error fetching parent categories');
      return;

    }
  };

  const handleAddToCart = async (productId) => {
    setIsLoading(true);
    try {
      const product = latestProducts.find((product) => product.id === productId);
      if (product.type === 'variable') {
        openVariationModal(product);  
        setIsLoading(false);
      } 
      else {
        await addToCart(product.id);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsLoading(false);
      return;

    }
  };
  

  const handleAddVariationToCart = async () => {
    if (selectedVariation) {
      const variationProduct = { ...selectedProduct };
      variationProduct.selectedVariation = selectedVariation;
      const response = await addToCart(selectedVariation);
      if(response=='added to cart')
      {
        setIsVariationModalVisible(false);
        setSelectedProduct(null)
        updateCartCount();
      }
      else{
        console.error('error adding to cart');
        return;
      }
    }
  };

  const handleReviewArticle = async () => {
    setIsShowReviewModal(true);
 };

  const handleSizeMe = () => {
    navigation.navigate('ARScreen',{countdown}); // Assuming 'navigation' is available in your component
  };


  const handleFilter = () => {
    //setAlertMessage("The 'Filter' feature is still in development. Stay tuned for updates!");
    //Show an alert for the "Filter" button
   // setShowAlert(true);
    setIsLoading(true);
    setIsCategoryModalVisible(true)
    renderCategoryCheckboxes();
    setIsLoading(false);
  };

  const handleCloseAlert = ()=> {
    setShowAlert(false);
  };
  
  return (
    <View style={styles.container}>
    <TopBar countdown={countdown} />
      <ScrollView style={styles.scrollView }
        onEndReachedThreshold={0.1}
      >
        {latestProducts.map((product, index) => (
          <View key={`${product.id}-${index}`} style={styles.articleContainer}>
            <Text style={styles.articleTitle}>{product.name}</Text>
            <View style={styles.carouselContainer}>
              <Carousel
                data={product.images}
                renderItem={({ item }) => (
                  <Image 
                    source={{ uri: item.src }}
                    style={styles.articleImage}
                    onLoad={handleImageLoad} // Call handleImageLoad when the image is loaded
                  />
                  
                )}
                sliderWidth={width}
                itemWidth={width}
                sliderHeight={500}
                itemHeight={500}
                layout="stack"
              />
              <Pagination
                dotsLength={product.images.length}
                activeDotIndex={0}
                containerStyle={styles.paginationContainer}
                dotStyle={styles.paginationDot}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
              />
            </View>
            <TouchableOpacity
            onPress={() => setDescriptionExpanded(!isDescriptionExpanded)} // Toggle the description state
          >
            <HTML
              source={{
                html: isDescriptionExpanded
                  ? product.description
                  : `${product.description.substring(0, 300)} read more...`
              }}
              contentWidth={width}
            />
          </TouchableOpacity>
            <Text style={styles.articlePrice}>
              Price:R <Text style={styles.priceText}>{product.price}</Text>
            </Text>
            <View style={styles.articleButtons}>
  <TouchableOpacity
    style={styles.likeButton}
    onPress={() => handleSizeMe()}
  >
    <Image
      source={require('../assets/measuring-tape.png')}
      style={styles.icon}
    />
    <Text style={CommonStyles.buttonTextRed} >Whats My Size</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.commentButton}
    onPress={() => handleReviewArticle()}
  >
    {isLoading ? (
      <ActivityIndicator color={Colors.body} />
    ) : (
      <View>
        <Image
          source={require('../assets/comment.png')}
          style={styles.icon}
        />
        <Text style={CommonStyles.buttonTextRed}>Our Reviews</Text>
      </View>
    )}
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.cartButton}
    onPress={() => handleAddToCart(product.id)}
  >
    {isLoading ? (
      <ActivityIndicator color={Colors.body} />
    ) : (
      <View>
        <Image
          source={require('../assets/cart.png')}
          style={styles.icon}
        />
        <Text style={CommonStyles.buttonTextRed} >Add To Cart</Text>
      </View>
    )}
  </TouchableOpacity>
</View>
          </View>
          
        ))}
        
        <View style={styles.loadMoreButtonContainer}>
        <TouchableOpacity
      style={styles.loadMoreButton}
      onPress={loadMoreProducts}
      disabled={isLoading} // Disable the button when loading
    >
      {isLoading ? (
        <ActivityIndicator color="white" /> // Show ActivityIndicator while loading
      ) : (
        <Text style={styles.loadMoreButtonText}>Load More</Text>
      )}
    </TouchableOpacity>
   </View>
      </ScrollView>

      {/* Floating button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {handleFilter()}}       
      >      
            <Image 
      source={require('../assets/filter.png')}
      style={styles.icon}
    />
      {isLoading ? (
      <ActivityIndicator color={Colors.body} />
          ) : (
        <Text style={styles.floatingButtonText}>Filter</Text>         
        )}
      </TouchableOpacity>

      {/* Variation Modal */}
      <Modal
        visible={isVariationModalVisible}
        transparent
        animationType="slide"
      >
        {selectedProduct && (
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContentContainer}>      
 
              {availableVariations.length > 0 && (
                <View>
                  <Text style={styles.pickerLabel}>Options</Text>
                  <ModalDropdown
                    options={availableVariations.map(
                      (variation) =>
                        variation.attributes[0]?.option || 'No Option'
                    )
                  }
                    onSelect={(index, value) => {
                      const selectedId = availableVariations[index]?.id;
                      setSelectedVariation(availableVariations[index]?.id);
                    }}
                    defaultValue="Select a variation"
                    style={styles.dropdown}
                    textStyle={styles.dropdownText}
                    dropdownStyle={styles.dropdownContainer}
                  />
                </View>
              )}

              {/* Add to Cart Button */}
              <TouchableOpacity
  style={[styles.modalButton, CommonStyles.buttonTextNormal]}
  onPress={handleAddVariationToCart}
  disabled={!selectedVariation || isLoadingVariations}
>
  {isLoadingVariations ? (
    <ActivityIndicator color={Colors.body} />
  ) : (
    <Text style={styles.modalButtonText}>
      {selectedVariation ? 'Add to Cart' : 'Select an Option First'}
    </Text>
  )}
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCloseButton]}
                onPress={() => closeVariationModal()}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>

       {/*review modal */}
      <Modal
        visible={isShowReviewModal}
        transparent
        animationType="slide"
       >
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#dd3333" />
          <Text>Loading...</Text>
        </View>
      )}
      <WebView
        style={styles.modalContainer2}
        originWhitelist={['*']}
        incognito={false}
        ref={webViewRef}
        source={{ uri: "https://1903laundry.co.za/reviews/" }}
        javaScriptEnabled={true}
        javaScriptEnabledAndroid={true}
        javaScriptEnabledIOS={true}
        sharedCookiesEnabled={true}
        onLoadStart={() => {
          setIsLoading(true);
        }}
        onLoadEnd={() => {
          onPageLoad();
          setIsLoading(false);
        }}
      />
                    {/* Close Button */}
              <TouchableOpacity
                style={[styles.modalWebCloseButton]}
                onPress={() => closeReviewModal()}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
      </Modal>

      {/* Due Date Prompt Modal */}
      {showDueDatePrompt && (
        <Modal visible={showDueDatePrompt} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.modalContentContainer}>
              {customer && (
                <Text style={styles.modalHeader}>
                  Welcome, {customer.first_name}!
                </Text>
              )}
              <Text style={DueDateModalStyles.dueDatePromptText}>
                Let's make your journey fun! Please enter your expected due date below:
              </Text>
              <Image 
                source={require('../assets/sketch.png')}
                contentFit="contain"
                style={styles.dueDateImage}
              />
              <TextInput
                value={dueDate}
                onChangeText={(text) => setDueDate(text)}
                placeholder="Select your due date"
                style={DueDateModalStyles.dueDateInput}
              />
              <Calendar
                current={dueDate}
                minDate={currentDateAsString}
                onDayPress={(day) => setDueDate(day.dateString)}
                markedDates={{ [dueDate]: { selected: true, marked: true } }}
                theme={{
                  selectedDayBackgroundColor: '#dd3333',
                  selectedDayTextColor: '#ffffff',
                }}
              />
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSaveButton]}
                onPress={async () => {
                  try {
                    if (customer) {
                      const updatedMetaData = customer.meta_data.concat({
                        key: 'expected_due_date',
                        value: dueDate,
                      });

                      await updateCustomerMetaData(customer.id, updatedMetaData);
                      await fetchCustomer();
                      setShowDueDatePrompt(false);
                      setIsLoading(false);
                    }
                  } catch (error) {
                    console.error('Error updating customer data:', error);
                    return;

                  }
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </Modal>
      )}

      {/* Category Filter Modal */}
      <Modal
        visible={isCategoryModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={[styles.modalContainer,styles.modalContentContainer]}>
          <ScrollView>
            {renderCategoryCheckboxes()}
          </ScrollView>
          <View style={[styles.filterContainer]}>
          <TouchableOpacity
                style={[styles.modalButton, styles.modalCloseButton]}
                onPress={applyCategoryFilters}
          >
           {isLoading ? (
            <ActivityIndicator color={Colors.body} />
            ) : (
            <Text style={styles.modalButtonText}>Apply Filters</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
                style={[styles.modalButton, styles.modalCloseButton]}
                onPress={clearCategoryFilters}
          >
                       {isLoading ? (
            <ActivityIndicator color={Colors.body} />
            ) : (
              <Text style={styles.modalButtonText}>Clear Filters</Text>
              )}
          </TouchableOpacity>

          <TouchableOpacity
                style={[styles.modalButton, styles.modalCloseButton]}
                onPress={setIsCategoryModalVisible}
          >
          {isLoading ? (
            <ActivityIndicator color={Colors.body} />
            ) : (
              <Text style={styles.modalButtonText}>Close</Text>
              )}
          </TouchableOpacity>
          </View>

        </View>
      </Modal>

        <CustomAlert
                  isVisible={showAlert}
                  onClose={handleCloseAlert}
                  message={alertMessage}
        />
      <BottomMenu navigation={navigation} cartItems={cart} cartCount={cartCount} countdown={countdown}/>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewProductName:{
    color: 'black',
    fontSize: 12,
    fontWeight: 'bold',
  },
  filterContainer: {
    alignItems: 'center',
    marginTop: 20, // Adjust the margin as needed
    paddingBottom:25,
  },
  loadMoreButtonContainer: {
    alignItems: 'center',
    marginTop: 20, // Adjust the margin as needed
    paddingBottom:25,
  },
  loadMoreButton: {
    ...CommonStyles.button,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loadMoreButtonText: {
    ...CommonStyles.buttonText,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },  
  categoryCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    color:'red',
  },
  floatingButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.08)', // Red color with 70% opacity
    position: 'absolute',
    padding:10,
    top: 330, // Adjust the bottom distance as needed
    right: 20, // Adjust the right distance as needed
    borderRadius: 30, // Button border radius (make it a circle)
    width: 60, // Button width
    height: 60, // Button height
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonText: {
    fontSize: 18, // Button text font size
    color: 'white', // Button text color
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  modalContainer2: {
     marginTop:210,
     marginBottom:40,
     marginLeft:8,
     marginRight:8,
     backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContentContainer: {
    backgroundColor: 'rgba(250, 235, 215, 0.98)',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    width: 375,
    height:425,
    marginTop:25,
  },
  modalContentContainer2: {
    backgroundColor: 'rgba(250, 235, 215, 0.98)',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    width: 375,
    marginTop:25,
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
  modalWebCloseButton:{
    backgroundColor: Colors.primary, // Button background color
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    marginBottom:25,
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
  dropdown: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    fontSize:35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 45,
    color: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    width: 350,
    maxHeight: 350,
    fontSize: 45,
    padding:10,
    justifyContent: 'center',
    alignItems: 'center',
    color:Colors.primary,
    backgroundColor:Colors.background,
  },
  dueDateImage: {
    width: '100%',
    height: 200, // Adjust the height as needed
    contentFit: 'contain',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    marginBottom: 75,
  },
  articleContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 15,
  },
  articleTitle: {
    fontSize: 20,
    fontWeight: 'thin',
    color: Colors.primary,
    marginBottom: 10,
  },
  carouselContainer: {
    alignItems: 'center',
  },
  articleImage: {
    marginLeft:10,
    width: 285,
    height: 270,
    contentFit: 'contain',
    marginBottom: 10,
    marginLeft: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  paginationContainer: {
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
  },
  priceText: {
    fontWeight: 'bold',
  },
  articleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  commentButton: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  cartButton: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
  },
  icon: {
    width: 35,
    height: 35,
    contentFit: 'contain',
  },
});

export default withLoadingOverlay(InstagramFeedScreen);