// AlarmReceiver.kt

package com.awesomeproject

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.awesomeproject.MyTaskService


class AlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Log.d("AlarmReceiver", "Alarm triggered, starting Headless JS task...")

        val serviceIntent = Intent(context, MyTaskService::class.java)
        context.startService(serviceIntent)
    }
}
