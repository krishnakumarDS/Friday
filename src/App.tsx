/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { Header } from "./components/header/Header";
import { FeaturedProducts } from "./components/featured-products/FeaturedProducts";
import { KnoBotPage } from "./pages/KnoBotPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <main className="main-content">
                <HomePage />
              </main>
            }
          />
          <Route path="/knobot" element={<KnoBotPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
