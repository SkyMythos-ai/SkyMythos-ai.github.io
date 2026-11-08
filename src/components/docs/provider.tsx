"use client";

import type { ReactNode } from "react";
import { useStaticSearch } from "fumadocs-core/search/client";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from "fumadocs-ui/components/dialog/search";
import type { SharedProps } from "fumadocs-ui/contexts/search";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Translations } from "fumadocs-ui/i18n";

function StaticSearchDialog(props: SharedProps) {
  const search = useStaticSearch({ from: "/search-index.json" });

  return (
    <SearchDialog {...search} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList />
      </SearchDialogContent>
    </SearchDialog>
  );
}

export function DocumentationProvider({
  children,
  translations,
}: {
  children: ReactNode;
  translations: Partial<Translations>;
}) {
  return (
    <RootProvider
      theme={{
        attribute: "data-theme",
        storageKey: "skymythos-theme",
        hotKey: false,
      }}
      i18n={{ translations }}
      search={{ SearchDialog: StaticSearchDialog }}
    >
      {children}
    </RootProvider>
  );
}
