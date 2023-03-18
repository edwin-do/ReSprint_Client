// @refresh reload
import { Suspense } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>ReSprint | Client Application</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            {/* <A href="/">Index</A>
            <A href="/about">About</A> */}
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
