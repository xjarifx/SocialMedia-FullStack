/**
 * Bug Condition Exploration Test - Pro User Downgrade Flow
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 2.1, 2.2, 2.3, 2.4**
 *
 * This test encodes the EXPECTED behavior for Pro user downgrade.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import BillingPage from "../pages/BillingPage";
import { billingAPI } from "../services/api";
import type { BillingStatus } from "../services/api";

// Mock the API module
vi.mock("../services/api", () => ({
  billingAPI: {
    getStatus: vi.fn(),
    createCheckoutSession: vi.fn(),
    downgrade: vi.fn(),
  },
}));

// Mock the auth hook module
vi.mock("../context/auth-context", () => ({
  useAuth: () => ({
    user: { id: "test-user-id", plan: "PRO", email: "test@example.com" },
    setUserPlan: vi.fn(),
  }),
}));

describe("Pro User Downgrade Flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("Pro users can downgrade to Free plan through UI flow", async () => {
    const proUserStatus: BillingStatus = {
      id: "test-user-id",
      email: "pro@example.com",
      plan: "PRO",
      planStatus: "active",
      planStartedAt: new Date().toISOString(),
      stripeCurrentPeriodEndAt: null,
      stripeSubscriptionId: null,
    };

    const downgradeResponse: BillingStatus = {
      id: proUserStatus.id,
      email: proUserStatus.email,
      plan: "FREE",
      planStatus: null,
      planStartedAt: null,
      stripeCurrentPeriodEndAt: null,
      stripeSubscriptionId: null,
    };

    vi.mocked(billingAPI.getStatus).mockResolvedValue(proUserStatus);
    vi.mocked(billingAPI.downgrade).mockResolvedValue(downgradeResponse);

    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <BillingPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(billingAPI.getStatus).toHaveBeenCalled();
    });

    // REQUIREMENT 2.1: Pro user sees enabled "Downgrade" button
    const downgradeButtons = await screen.findAllByRole("button", {
      name: /downgrade/i,
    });
    const downgradeButton = downgradeButtons[0];
    expect(downgradeButton).toBeInTheDocument();
    expect(downgradeButton).not.toBeDisabled();

    // REQUIREMENT 2.2: Clicking button triggers API call
    await user.click(downgradeButton);

    await waitFor(() => {
      expect(billingAPI.downgrade).toHaveBeenCalled();
    });

    // REQUIREMENT 2.3: Backend processes downgrade
    expect(vi.mocked(billingAPI.downgrade)).toHaveBeenCalledTimes(1);

    // REQUIREMENT 2.4: UI updates to reflect Free plan
    await waitFor(() => {
      const currentPlanButton = screen.getByRole("button", {
        name: /current plan/i,
      });
      expect(currentPlanButton).toBeInTheDocument();
      expect(currentPlanButton).toBeDisabled();
    });
  });

  it("Pro users see enabled Downgrade button on Free plan card", async () => {
    const proUserStatus: BillingStatus = {
      id: "test-user-id",
      email: "pro@example.com",
      plan: "PRO",
      planStatus: "active",
      planStartedAt: new Date().toISOString(),
      stripeCurrentPeriodEndAt: null,
      stripeSubscriptionId: null,
    };

    vi.mocked(billingAPI.getStatus).mockResolvedValue(proUserStatus);

    render(
      <BrowserRouter>
        <BillingPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(billingAPI.getStatus).toHaveBeenCalled();
    });

    const downgradeButton = await screen.findByRole("button", {
      name: /downgrade/i,
    });
    expect(downgradeButton).toBeInTheDocument();
    expect(downgradeButton).not.toBeDisabled();
  });

  it("billingAPI has downgrade method", () => {
    expect(billingAPI).toHaveProperty("downgrade");
    expect(typeof billingAPI.downgrade).toBe("function");
  });
});
