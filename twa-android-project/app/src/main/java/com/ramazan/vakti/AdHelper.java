package com.ramazan.vakti;

import android.app.Activity;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Display;
import android.widget.FrameLayout;

import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.initialization.InitializationStatus;
import com.google.android.gms.ads.initialization.OnInitializationCompleteListener;

/**
 * AdHelper - AdMob reklam yönetimi
 * Banner reklamları yönetir
 */
public class AdHelper {
    
    private static final String TAG = "AdHelper";
    
    // Banner Ad Unit ID
    private static final String BANNER_AD_UNIT_ID = "ca-app-pub-4069218897705958/5397383982";
    
    private Activity activity;
    private AdView adView;
    private FrameLayout adContainer;
    
    public AdHelper(Activity activity) {
        this.activity = activity;
    }
    
    /**
     * AdMob'u başlat
     */
    public void initialize() {
        MobileAds.initialize(activity, new OnInitializationCompleteListener() {
            @Override
            public void onInitializationComplete(InitializationStatus initializationStatus) {
                Log.d(TAG, "AdMob initialized successfully");
            }
        });
    }
    
    /**
     * Banner reklam yükle ve göster
     */
    public void loadBannerAd(FrameLayout container) {
        this.adContainer = container;
        
        adView = new AdView(activity);
        adView.setAdUnitId(BANNER_AD_UNIT_ID);
        adView.setAdSize(getAdSize());
        
        AdRequest adRequest = new AdRequest.Builder().build();
        adView.loadAd(adRequest);
        
        container.addView(adView);
        Log.d(TAG, "Banner ad loading...");
    }
    
    /**
     * Ekran genişliğine göre banner boyutu hesapla
     */
    private AdSize getAdSize() {
        Display display = activity.getWindowManager().getDefaultDisplay();
        DisplayMetrics outMetrics = new DisplayMetrics();
        display.getMetrics(outMetrics);
        
        float widthPixels = outMetrics.widthPixels;
        float density = outMetrics.density;
        int adWidth = (int) (widthPixels / density);
        
        return AdSize.getCurrentOrientationAnchoredAdaptiveBannerAdSize(activity, adWidth);
    }
    
    /**
     * Reklamları temizle
     */
    public void destroy() {
        if (adView != null) {
            adView.destroy();
        }
    }
    
    /**
     * Reklamları duraklat
     */
    public void pause() {
        if (adView != null) {
            adView.pause();
        }
    }
    
    /**
     * Reklamları devam ettir
     */
    public void resume() {
        if (adView != null) {
            adView.resume();
        }
    }
}
