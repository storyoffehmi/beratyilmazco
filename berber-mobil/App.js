import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

// --- DEĞİŞTİRİLECEK ALAN ---
// Buraya kendi React web uygulamanızın yayınlandığı adresi yazacaksınız.
// Şimdilik test için bir placeholder (yer tutucu) adres kullanalım.
const WEBSITE_URL = "https://expo.dev"; 

// Web sitesi yüklenirken görünecek olan yükleme animasyonu
const LoadingIndicator = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#007bff" />
  </View>
);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      {/* StatusBar, telefonun en üstündeki saat, pil gibi ikonların rengini ayarlar */}
      <StatusBar barStyle="dark-content" />
      <WebView
        style={styles.webview}
        source={{ uri: WEBSITE_URL }}
        // WebView yüklenmeye başlarken ve biterken ne olacağını belirler
        renderLoading={LoadingIndicator}
        startInLoadingState={true}
      />
    </SafeAreaView>
  );
}

// React Native'de stiller bu şekilde tanımlanır
const styles = StyleSheet.create({
  container: {
    flex: 1, // Bu stil, alanın ekranı tamamen kaplamasını sağlar
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    // Bu stil, yükleme animasyonunu ekranın ortasına konumlandırır
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});