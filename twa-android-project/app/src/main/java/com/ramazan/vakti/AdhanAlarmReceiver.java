package com.ramazan.vakti;

import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import java.util.Calendar;

/**
 * AdhanAlarmReceiver - Ezan vakitlerinde bildirim ve ses çalar
 * Bu sınıf, belirlenen namaz vakitlerinde arka planda çalışarak
 * ezan sesini çalar ve bildirim gösterir.
 */
public class AdhanAlarmReceiver extends BroadcastReceiver {
    
    private static final String CHANNEL_ID = "adhan_channel";
    private static final String CHANNEL_NAME = "Ezan Bildirimleri";
    
    @Override
    public void onReceive(Context context, Intent intent) {
        String prayerName = intent.getStringExtra("prayer_name");
        if (prayerName == null) prayerName = "Namaz Vakti";
        
        createNotificationChannel(context);
        showNotification(context, prayerName);
        playAdhanSound(context);
    }
    
    private void createNotificationChannel(Context context) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Ezan vakti bildirimleri");
            channel.enableVibration(true);
            channel.setVibrationPattern(new long[]{0, 1000, 500, 1000, 500, 1000});
            channel.setBypassDnd(true); // Rahatsız Etmeyin modunu atla
            
            // Varsayılan alarm sesini kullan
            Uri defaultAlarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build();
            channel.setSound(defaultAlarmSound, audioAttributes);
            
            NotificationManager notificationManager = context.getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }
    
    private void showNotification(Context context, String prayerName) {
        Intent intent = new Intent(context, LauncherActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context, 0, intent, PendingIntent.FLAG_IMMUTABLE
        );
        
        // Varsayılan alarm sesini kullan (adhan dosyası eklenene kadar)
        Uri defaultSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
        if (defaultSound == null) {
            defaultSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
        }
        
        long[] vibrationPattern = new long[]{0, 1000, 500, 1000, 500, 1000};
        
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_launcher)
            .setContentTitle("🕌 " + prayerName)
            .setContentText("Ezan vakti geldi. Allah kabul etsin.")
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .setSound(defaultSound)
            .setVibrate(vibrationPattern)
            .setDefaults(NotificationCompat.DEFAULT_LIGHTS)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true);
        
        NotificationManager notificationManager = 
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify((int) System.currentTimeMillis(), builder.build());
    }
    
    private void playAdhanSound(Context context) {
        // Bildirim sesi zaten kanalda ayarlandı
        // Ek olarak MediaPlayer ile uzun ezan çalınabilir
    }
    
    /**
     * Alarm kurma yardımcı metodu
     * WebView'dan JavaScript bridge ile çağrılabilir
     */
    public static void scheduleAdhan(Context context, String prayerName, int hour, int minute) {
        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        
        Intent intent = new Intent(context, AdhanAlarmReceiver.class);
        intent.putExtra("prayer_name", prayerName);
        
        int requestCode = (prayerName + hour + minute).hashCode();
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context, requestCode, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, 0);
        
        // Eğer zaman geçmişse, yarına ayarla
        if (calendar.getTimeInMillis() <= System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_YEAR, 1);
        }
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setExactAndAllowWhileIdle(
                AlarmManager.RTC_WAKEUP,
                calendar.getTimeInMillis(),
                pendingIntent
            );
        } else {
            alarmManager.setExact(
                AlarmManager.RTC_WAKEUP,
                calendar.getTimeInMillis(),
                pendingIntent
            );
        }
    }
}
