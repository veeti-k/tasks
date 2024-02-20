//
//  ContentView.swift
//  tasks
//
//  Created by veeti on 20.2.2024.
//

import SwiftUI

struct ContentView: View {
    @State private var selection: AppScreen? = .home
    
    var body: some View {
        AppTabView(selection: $selection)
    }
}

#Preview {
    ContentView()
}
