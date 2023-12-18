"use client";
import PublicListView from "@/app/components/PublicListView";
import { useParams } from "next/navigation";

function PublicList() {
  const params = useParams();
  const { listHash } = params;
  return <PublicListView hash={listHash} />;
}

export default PublicList;
