//
//  TagPicker.swift
//  tasks
//
//  Created by veeti on 21.2.2024.
//

import SwiftUI

struct TagPicker: View {
    @Binding var selection: String
    @Binding var tags: [String]
    
    @State private var isPickerOpen = false
    @State private var searchInput = ""
    
    var filteredItems: [String] {
        searchInput.isEmpty ? tags : tags.filter { $0.localizedCaseInsensitiveContains(searchInput) }
    }
    
    var body: some View {
        Button(action: {
            isPickerOpen.toggle()
        }) {
            HStack {
                Text(selection)
                Image(systemName: "chevron.up.chevron.down")
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(Color.gray.opacity(0.2))
            .cornerRadius(12)
        }
        .sheet(isPresented: $isPickerOpen) {
            NavigationView {
                List(filteredItems, id: \.self) { item in
                    Text(item)
                }
                .navigationTitle("Select a tag")
                #if os(iOS)
                .navigationBarTitleDisplayMode(.inline)
                #endif
                .searchable(
                    text: $searchInput,
                    placement: {
                        #if os(iOS)
                        return .navigationBarDrawer(displayMode: .automatic)
                        #endif
                        return .automatic
                    }()
                )
            }.presentationDetents([.medium])
        }
    }
}

#Preview {
    TagPicker(
        selection: Binding.constant("coding"),
        tags: Binding.constant(["coding", "gaming"])
    )
}
