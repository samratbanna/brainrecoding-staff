"use client";

import { MainLayout } from "@/layouts/MainLayouts";
import { TaskList } from "@/component/task";

export default function Page() {
  return (
    <MainLayout>
      <TaskList />
    </MainLayout>
  );
}
