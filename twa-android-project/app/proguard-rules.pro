# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /sdk/tools/proguard/proguard-android.txt

# Keep WebView JavaScript Interface
-keepclassmembers class com.ramazan.vakti.AdhanBridge {
   public *;
}

# Keep BroadcastReceivers
-keep public class com.ramazan.vakti.AdhanAlarmReceiver
-keep public class com.ramazan.vakti.BootReceiver
