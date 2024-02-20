//
//  TimeButtons.swift
//  tasks
//
//  Created by veeti on 21.2.2024.
//

import SwiftUI

struct TimeButton: View {
    let title: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .padding(4)
                .frame(maxWidth: .infinity)
        }
        .buttonStyle(.bordered)
    }
}

struct TimeButtonsContainer<Content>: View where Content: View {
    let content: Content
    
    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    var body: some View {
        VStack {
            VStack {
                content
            }
            .padding(8)
        }
        .background(Color.gray.opacity(0.1))
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
}

