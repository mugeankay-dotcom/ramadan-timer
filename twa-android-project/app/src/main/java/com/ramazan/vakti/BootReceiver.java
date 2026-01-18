package com.ramazan.vakti;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;

/**
 * BootReceiver - Cihaz yeniden başlatıldığında alarmları yeniden kurar
 */
public class BootReceiver extends BroadcastReceiver {
    
    private static final String TAG = "BootReceiver";
    private static final String PREFS_NAME = "RamadanPrefs";
    
    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            Log.d(TAG, "Boot completed - rescheduling prayer alarms");
            
            SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            
            // Retrieve saved prayer times and reschedule
            String imsak = prefs.getString("imsak", null);
            String gunes = prefs.getString("gunes", null);
            String ogle = prefs.getString("ogle", null);
            String ikindi = prefs.getString("ikindi", null);
            String aksam = prefs.getString("aksam", null);
            String yatsi = prefs.getString("yatsi", null);
            
            if (imsak != null) {
                scheduleFromString(context, "İmsak", imsak);
            }
            if (aksam != null) {
                scheduleFromString(context, "İftar", aksam);
            }
            if (yatsi != null) {
                scheduleFromString(context, "Yatsı", yatsi);
            }
            // Add other prayers as needed
        }
    }
    
    private void scheduleFromString(Context context, String name, String time) {
        try {
            String[] parts = time.split(":");
            int hour = Integer.parseInt(parts[0]);
            int minute = Integer.parseInt(parts[1]);
            AdhanAlarmReceiver.scheduleAdhan(context, name, hour, minute);
            Log.d(TAG, "Rescheduled " + name + " at " + time);
        } catch (Exception e) {
            Log.e(TAG, "Error scheduling " + name, e);
        }
    }
}
