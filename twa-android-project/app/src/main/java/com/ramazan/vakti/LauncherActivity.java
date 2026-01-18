package com.ramazan.vakti;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.GeolocationPermissions;
import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import androidx.appcompat.app.AppCompatActivity;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.graphics.Insets;

/**
 * LauncherActivity - Ana TWA başlatıcı aktivite
 * WebView içinde PWA'yı açar ve JavaScript bridge ile native alarm kurar
 * AdMob banner reklam gösterir
 */
public class LauncherActivity extends AppCompatActivity {
    
    private static final String PWA_URL = "https://mugeankay-dotcom.github.io/ramadan-timer/";
    private static final int NOTIFICATION_PERMISSION_CODE = 100;
    private static final int LOCATION_PERMISSION_CODE = 101;
    private WebView webView;
    private AdHelper adHelper;
    private FrameLayout adContainer;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Request notification permission for Android 13+
        requestNotificationPermission();
        
        // Create main layout
        LinearLayout mainLayout = new LinearLayout(this);
        mainLayout.setOrientation(LinearLayout.VERTICAL);
        mainLayout.setLayoutParams(new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));
        
        // Create WebView
        webView = new WebView(this);
        LinearLayout.LayoutParams webViewParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            0,
            1.0f // Weight = 1 to fill remaining space
        );
        webView.setLayoutParams(webViewParams);
        
        // Create Ad Container at bottom
        adContainer = new FrameLayout(this);
        LinearLayout.LayoutParams adParams = new LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT
        );
        adContainer.setLayoutParams(adParams);
        
        // Apply WindowInsets to keep ad above system navigation bar
        ViewCompat.setOnApplyWindowInsetsListener(adContainer, (v, windowInsets) -> {
            Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
            // Add padding at the bottom equal to navigation bar height
            v.setPadding(0, 0, 0, insets.bottom);
            return windowInsets;
        });
        
        // Add views to layout
        mainLayout.addView(webView);
        mainLayout.addView(adContainer);
        
        setContentView(mainLayout);
        
        // Enable edge-to-edge for proper WindowInsets handling
        ViewCompat.setOnApplyWindowInsetsListener(mainLayout, (v, windowInsets) -> {
            // Return insets so child views can consume them
            return windowInsets;
        });
        
        // Configure WebView
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setGeolocationEnabled(true); // Enable geolocation
        
        // Add JavaScript interface for native alarm scheduling
        webView.addJavascriptInterface(new AdhanBridge(this), "AndroidBridge");
        
        // Set WebView client
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                // Inject script to detect native app and schedule alarms
                injectNativeDetection();
            }
        });
        
        // Set WebChromeClient with geolocation permission
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                // Request location permission if needed
                if (ContextCompat.checkSelfPermission(LauncherActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) 
                        == PackageManager.PERMISSION_GRANTED) {
                    callback.invoke(origin, true, false);
                } else {
                    // Request permission first
                    ActivityCompat.requestPermissions(LauncherActivity.this, 
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, 
                        LOCATION_PERMISSION_CODE);
                    // Grant anyway for now (will be prompted by system)
                    callback.invoke(origin, true, false);
                }
            }
        });
        
        // Load PWA
        webView.loadUrl(PWA_URL);
        
        // Initialize and load ads
        adHelper = new AdHelper(this);
        adHelper.initialize();
        adHelper.loadBannerAd(adContainer);
    }
    
    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) 
                    != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, 
                    new String[]{Manifest.permission.POST_NOTIFICATIONS}, 
                    NOTIFICATION_PERMISSION_CODE);
            }
        }
    }
    
    private void injectNativeDetection() {
        String js = "if(typeof window.AndroidBridge !== 'undefined') {" +
                    "  console.log('✅ Native Android Bridge Detected!');" +
                    "  window.isNativeApp = true;" +
                    "  if(typeof prayerTimesData !== 'undefined' && prayerTimesData) {" +
                    "    AndroidBridge.scheduleAllPrayers(" +
                    "      prayerTimesData.Imsak," +
                    "      prayerTimesData.Sunrise," +
                    "      prayerTimesData.Dhuhr," +
                    "      prayerTimesData.Asr," +
                    "      prayerTimesData.Maghrib," +
                    "      prayerTimesData.Isha" +
                    "    );" +
                    "    console.log('✅ Prayer alarms scheduled via native bridge');" +
                    "  }" +
                    "}";
        webView.evaluateJavascript(js, null);
    }
    
    @Override
    protected void onResume() {
        super.onResume();
        if (adHelper != null) adHelper.resume();
    }
    
    @Override
    protected void onPause() {
        if (adHelper != null) adHelper.pause();
        super.onPause();
    }
    
    @Override
    protected void onDestroy() {
        if (adHelper != null) adHelper.destroy();
        super.onDestroy();
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}

