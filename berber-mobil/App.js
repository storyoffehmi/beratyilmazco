import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

// --- GÜNCELLENEN ALAN ---
// Adresi sizin Netlify adresinizle değiştirdik.
const WEBSITE_URL = "https://wondrous-flan-bc83d9.netlify.app"; 

// Web sitesi yüklenirken görünecek olan yükleme animasyonu
const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007bff" />
  </View>
);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <WebView
        style={styles.webview}
        source={{ uri: WEBSITE_URL }}
        renderLoading={LoadingIndicator}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}

// Stiller aynı kalıyor
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});