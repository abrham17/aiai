'use client';

import { useEffect, useState } from 'react';
import { getModule } from '@/core/registry';
import type { Module } from '@/core/types';

interface ModuleLoadState {
  requestedId: string;
  module: Module | null;
}

export function useModuleData(moduleId: string) {
  const [loadState, setLoadState] = useState<ModuleLoadState | null>(null);

  useEffect(() => {
    let cancelled = false;

    getModule(moduleId).then((module) => {
      if (cancelled) return;
      setLoadState({ requestedId: moduleId, module });
    });

    return () => {
      cancelled = true;
    };
  }, [moduleId]);

  const isLoading = loadState?.requestedId !== moduleId;
  const moduleData = isLoading ? null : loadState.module;

  return { isLoading, moduleData };
}
