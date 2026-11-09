import React from "react";
import { inject } from "mobx-react";
import { cn } from "../../utils/bem";
import { Button, Message, useAppTranslation } from "@humansignal/ui";
import { FilterLine, FILTER_CHROME_ICON_SIZE } from "./FilterLine/FilterLine";
import {
  ArrowCounterClockwiseIcon,
  ClipboardTextIcon,
  CopySimpleIcon,
  PlusIcon,
  SidebarSimpleIcon,
} from "@humansignal/icons";
import { useRecentFilters } from "../../hooks/useRecentFilters";
import "./Filters.prefix.css";

const injector = inject(({ store }) => ({
  store,
  views: store.viewsStore,
  currentView: store.currentView,
  filters: store.currentView?.currentFilters ?? [],
  projectId: store.SDK?.projectId,
}));

export const Filters = injector(({ store, views, currentView, filters, projectId }) => {
  const [t] = useAppTranslation();
  const { sidebarEnabled } = views;
  const isLocked = currentView?.isLockedByManager;
  const lockedTooltip = currentView?.lockedUpdateMessage;
  const lockedFiltersMessage = currentView?.lockedFiltersMessage;
  const { fields, recentEntries, saveOnSwitch, saveInPlace } = useRecentFilters(
    projectId,
    currentView.availableFilters,
  );
  const [copyFeedback, setCopyFeedback] = React.useState(false);
  const [pasteFeedback, setPasteFeedback] = React.useState(false);
  const [prePasteSnapshot, setPrePasteSnapshot] = React.useState(null);

  const handleCopyFilters = React.useCallback(async () => {
    try {
      const snapshot = currentView.allFiltersSnapshot;
      await navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    } catch (e) {
      console.warn("Failed to copy filters:", e);
    }
  }, [currentView]);

  const showToast = React.useCallback(
    (message, type = "error") => {
      store?.SDK?.invoke?.("toast", { message, type });
    },
    [store],
  );

  const handlePasteFilters = React.useCallback(async () => {
    let text;
    try {
      text = await navigator.clipboard.readText();
    } catch {
      showToast(t("dm.filters.clipboardReadError"));
      return;
    }

    let snapshot;
    try {
      snapshot = JSON.parse(text);
    } catch {
      showToast(t("dm.filters.clipboardInvalidJson"));
      return;
    }

    if (!snapshot || typeof snapshot !== "object" || !Array.isArray(snapshot.items)) {
      showToast(t("dm.filters.invalidFormat"));
      return;
    }

    const beforePaste = currentView.allFiltersSnapshot;

    const result = currentView.importFilters(snapshot);
    if (result === false) {
      showToast(t("dm.filters.noMatchingColumns"));
      return;
    }

    setPrePasteSnapshot(beforePaste);
    setPasteFeedback(true);
    setTimeout(() => setPasteFeedback(false), 1500);
  }, [currentView, showToast, t]);

  const handleUndoPaste = React.useCallback(() => {
    if (!prePasteSnapshot) return;
    currentView.importFilters(prePasteSnapshot);
    setPrePasteSnapshot(null);
  }, [currentView, prePasteSnapshot]);

  return (
    <div className={cn("filters").mod({ sidebar: sidebarEnabled }).toClassName()}>
      {isLocked && lockedFiltersMessage ? (
        <Message variant="warning" size="small" data-testid="filters-locked-message" className="m-base mb-0">
          {lockedFiltersMessage}
        </Message>
      ) : null}
      <div className={cn("filters").elem("list").mod({ withFilters: !!filters.length }).toClassName()}>
        {filters.length ? (
          filters.map((filter, i) => (
            <FilterLine
              index={i}
              filter={filter}
              view={currentView}
              key={filter.id}
              pickerFilters={currentView.availableFilters}
              recentEntries={recentEntries}
              onSaveOnSwitch={saveOnSwitch}
              onSaveInPlace={saveInPlace}
              disabled={isLocked}
              disabledTooltip={isLocked ? lockedTooltip : undefined}
            />
          ))
        ) : (
          <div className={cn("filters").elem("empty").toClassName()}>{t("dm.filters.noFiltersApplied")}</div>
        )}
      </div>
      <div className={cn("filters").elem("actions").toClassName()}>
        <Button
          size="small"
          look="string"
          disabled={isLocked}
          tooltip={isLocked ? lockedTooltip : undefined}
          onClick={() => currentView.createFilter()}
          data-testid="filters-add-filter"
          className="p-tighter [&_em]:size-500"
          leading={<PlusIcon size={FILTER_CHROME_ICON_SIZE} className="shrink-0" aria-hidden="true" />}
        >
          {filters.length ? t("dm.filters.addAnotherFilter") : t("dm.filters.addFilter")}
        </Button>

        <div className={cn("filters").elem("actions-right").toClassName()}>
          {filters.length > 0 && (
            <Button
              size="small"
              look="string"
              tooltip={copyFeedback ? t("dm.filters.copied") : t("dm.filters.copyAsJson")}
              onClick={handleCopyFilters}
              aria-label={t("dm.filters.copyAsJson")}
              leading={<CopySimpleIcon size={FILTER_CHROME_ICON_SIZE} aria-hidden="true" />}
              data-testid="filters-copy"
            />
          )}

          <Button
            size="small"
            look="string"
            disabled={isLocked}
            tooltip={isLocked ? lockedTooltip : pasteFeedback ? t("dm.filters.pasted") : t("dm.filters.pasteFromJson")}
            onClick={handlePasteFilters}
            aria-label={t("dm.filters.pasteFromJson")}
            leading={<ClipboardTextIcon size={FILTER_CHROME_ICON_SIZE} aria-hidden="true" />}
            data-testid="filters-paste"
          />

          {prePasteSnapshot && (
            <Button
              size="small"
              look="string"
              disabled={isLocked}
              tooltip={isLocked ? lockedTooltip : t("dm.filters.undoPaste")}
              onClick={handleUndoPaste}
              aria-label={t("dm.filters.undoPaste")}
              leading={<ArrowCounterClockwiseIcon size={FILTER_CHROME_ICON_SIZE} aria-hidden="true" />}
              data-testid="filters-undo-paste"
            />
          )}

          {!sidebarEnabled ? (
            <Button
              look="string"
              size="small"
              tooltip={t("dm.filters.pinToSidebar")}
              onClick={() => views.expandFilters()}
              aria-label={t("dm.filters.pinToSidebar")}
              leading={<SidebarSimpleIcon size={FILTER_CHROME_ICON_SIZE} className="rotate-180" aria-hidden="true" />}
              data-testid="filters-pin-sidebar"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
});
