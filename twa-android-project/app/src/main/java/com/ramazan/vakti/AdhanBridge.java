package com.ramazan.vakti;

import android.webkit.JavascriptInterface;
import android.content.Context;
import android.util.Log;

/**
 * JavaScript Bridge - Web uygulaması ile native Android arasında köprü
 * WebView'dan çağrılabilir metotlar içerir
 */
public class AdhanBridge {
    
    private static final String TAG = "AdhanBridge";
    private Context context;
    
    public AdhanBridge(Context context) {
        this.context = context;
    }
    
    /**
     * Ezan alarmı kur
     * JavaScript'ten çağrı: AndroidBridge.scheduleAdhan("İftar", 17, 30)
     */
    @JavascriptInterface
    public void scheduleAdhan(String prayerName, int hour, int minute) {
        Log.d(TAG, "Scheduling adhan for " + prayerName + " at " + hour + ":" + minute);
        AdhanAlarmReceiver.scheduleAdhan(context, prayerName, hour, minute);
    }
    
    /**
     * Tüm namaz vakitleri için alarm kur
     * JavaScript'ten çağrı: AndroidBridge.scheduleAllPrayers(imsak, gunes, ogle, ikindi, aksam, yatsi)
     * Format: "HH:mm"
     */
    @JavascriptInterface
    public void scheduleAllPrayers(String imsak, String gunes, String ogle, 
                                    String ikindi, String aksam, String yatsi) {
        Log.d(TAG, "Scheduling all prayers");
        
        scheduleFromTimeString("İmsak", imsak);
        scheduleFromTimeString("Güneş", gunes);
        scheduleFromTimeString("Öğle", ogle);
        scheduleFromTimeString("İkindi", ikindi);
        scheduleFromTimeString("İftar", aksam);
        scheduleFromTimeString("Yatsı", yatsi);
    }
    
    private void scheduleFromTimeString(String name, String time) {
        try {
            String[] parts = time.split(":");
            int hour = Integer.parseInt(parts[0]);
            int minute = Integer.parseInt(parts[1]);
            AdhanAlarmReceiver.scheduleAdhan(context, name, hour, minute);
        } catch (Exception e) {
            Log.e(TAG, "Error parsing time: " + time, e);
        }
    }
    
    /**
     * Test için hemen ezan çal
     */
    @JavascriptInterface
    public void testAdhan() {
        Log.d(TAG, "Testing adhan - scheduling for 5 seconds from now");
        // 5 saniye sonrası için test alarmı kur
        java.util.Calendar cal = java.util.Calendar.getInstance();
        cal.add(java.util.Calendar.SECOND, 5);
        AdhanAlarmReceiver.scheduleAdhan(context, "Test Ezanı", 
            cal.get(java.util.Calendar.HOUR_OF_DAY), 
            cal.get(java.util.Calendar.MINUTE));
    }
    
    /**
     * Uygulama versiyonunu döndür
     */
    @JavascriptInterface
    public String getAppVersion() {
        return "1.0.0-twa";
    }
    
    /**
     * Native Android olup olmadığını kontrol et
     */
    @JavascriptInterface
    public boolean isNativeApp() {
        return true;
    }
}
