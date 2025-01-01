import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useAppState } from "./hooks/useAppstate/useAppState";
import ErrorBoundary from "./Components/ErrorBoundary";

// Dynamically import components
const TodoApp = lazy(() => import("client_app/TodoApp"));
const CalcApp = lazy(() => import("calc_app/CalcApp"));

function App() {
  const {
    isTodoAppDisabled,
    isCalcAppDisabled,
    handleError,
    resetAppState,
  } = useAppState();

  return (
    <>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/todo">Todo App</Link>
              </li>
       
              <li>
                <Link to="/calc">Calc App</Link>
              </li>
            </ul>
            <button onClick={() => resetAppState("todo")}>Reset Todo App</button>
            <button onClick={() => resetAppState("calc")}>Reset Calc App</button>
          </nav>

          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/todo"
                element={
                  isTodoAppDisabled ? (
                    <div>Todo App is under maintenance.</div>
                  ) : (
                    <ErrorBoundary app="todo" handleError={handleError}>
                      <TodoApp />
                    </ErrorBoundary>
                  )
                }
              />

              <Route
                path="/calc"
                element={
                  isCalcAppDisabled ? (
                    <div>Calc App is under maintenance.</div>
                  ) : (
                    <ErrorBoundary app="calc" handleError={handleError}>
                      <CalcApp />
                    </ErrorBoundary>
                  )
                }
              />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </>
  );
}

export default App;
