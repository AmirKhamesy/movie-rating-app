"use client";
import { useParams } from "next/navigation";

function PublicList() {
  const params = useParams();
  const { listHash } = params;
  return <div>{listHash}</div>;
}

export default PublicList;
