//
// 4homeNavStack.swift
//  tasks
//
//  Created by veeti on 20.2.2024.
//

import SwiftUI

struct HomeNavStack: View {
    @State private var time = 7200
    @State private var selectedTag = "coding"
    
    @State private var tags = ["coding", "gaming"]
    
    var body: some View {
        NavigationStack {
            VStack {
                Time(time: $time)
                
                VStack {
                    VStack {
                        LazyVGrid(
                            columns: [
                                GridItem(.flexible(), spacing: 10),
                                GridItem(.flexible(), spacing: 10)
                            ], spacing: 10) {
                                TimeButtonsContainer {
                                    TimeButton(title: "+ 5 min", action: {})
                                    TimeButton(title: "- 5 min", action: {})
                                }
                                TimeButtonsContainer {
                                    TimeButton(title: "+ 30 min", action: {})
                                    TimeButton(title: "- 30 min", action: {})
                                }
                            }
                            .padding(8)
                    }
                    .cornerRadius(16)
                }
                .padding(.horizontal, 20)
                .padding(.top, 24)
                
                TagPicker(
                    selection: $selectedTag,
                    tags: $tags
                )
                .padding(.top, 24)
                
                Button(action: {}) {
                    Text("start")
                        .padding(.horizontal, 16)
                        .padding(.vertical, 6)
                }
                .buttonStyle(.bordered)
                .padding(.top, 24)
            }.padding(40)
        }
    }
}

#Preview {
    HomeNavStack()
}
