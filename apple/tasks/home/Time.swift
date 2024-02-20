//
//  Time.swift
//  tasks
//
//  Created by veeti on 21.2.2024.
//

import SwiftUI

struct Time: View {
    @Binding var time: Int
    
    var body: some View {
        Text("\(timeString(time: time))")
            .font(.system(size: 80))
            .fontWeight(.medium)
            .padding(.vertical, 4)
            .padding(.horizontal)
            .background(Color.gray.opacity(0.25))
            .cornerRadius(16)
    }
    
    func startTimer() {
        Timer.scheduledTimer(withTimeInterval: 1, repeats: true) { timer in
            if self.time > 0 {
                self.time -= 1
            } else {
                timer.invalidate()
            }
        }
    }
    
    func timeString(time: Int) -> String {
        let minutes = time / 60
        let seconds = time % 60
        return String(format: "%02d:%02d", minutes, seconds)
    }
}

#Preview {
    Time(time: Binding.constant(7200))
}
