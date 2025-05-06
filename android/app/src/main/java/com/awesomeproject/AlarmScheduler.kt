// android/app/src/main/java/com/awesomeproject/AlarmScheduler.kt
package com.awesomeproject

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class AlarmScheduler(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AlarmScheduler" // 👈 Must match what you use in JavaScript
    }

    @ReactMethod
    fun scheduleAlarm() {
        val context = reactApplicationContext
        val intent = Intent(context, AlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val triggerTime = System.currentTimeMillis() + 60 * 1000 // 1 minute later

        alarmManager.setRepeating(
            AlarmManager.RTC_WAKEUP,
            System.currentTimeMillis() + 60 * 100L,
            60 * 1000L, // repeat every 1 min
            pendingIntent
        )
    }
}
