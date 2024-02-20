//
//  appScreen.swift
//  tasks
//
//  Created by veeti on 20.2.2024.
//

import SwiftUI

enum AppScreen: Codable, Hashable, Identifiable, CaseIterable {
    case home
    case stats
    case tags
    case tasks
    case settings
    
    var id: AppScreen { self }
}

extension AppScreen {
    @ViewBuilder
    var label: some View {
        switch self {
        case .home:
            Label("home", systemImage: "bird")
        case .stats:
            Label("stats", systemImage: "info.circle")
        case .tags:
            Label("tags", systemImage: "tag.fill")
        case .tasks:
            Label("tasks", systemImage: "list.bullet")
        case .settings:
            Label("settings", systemImage: "gear")
        }
    }
    
    @ViewBuilder
    var destination: some View {
        switch self {
        case .home:
            HomeNavStack()
        case .stats:
            HomeNavStack()
        case .tags:
            HomeNavStack()
        case .tasks:
            HomeNavStack()
        case .settings:
            HomeNavStack()
        }
    }
}
