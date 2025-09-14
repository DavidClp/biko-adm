import React, { useEffect, useRef } from "react";
import { LoadingSpinner } from "./ui/loading-spinner";

interface ILoadingSearch {
  loading: boolean;
  text?: string;
  children?: React.ReactNode;
}

export const ContentOrLoading: React.FC<ILoadingSearch> = (props) => {
  const { loading, text = "", children } = props;

  const content_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    content_ref.current?.click();
  }, [loading]);

  return (
    <>
      {loading && (
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: 16,
          }}
        >
          <h6 style={{ textAlign: "center" }}>{text}</h6>
          <LoadingSpinner
          />
        </div>
      )}
      {!loading && children}
    </>
  );
};
