from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Go to the home page and take a screenshot
    page.goto("http://localhost:5173/")
    page.wait_for_selector('.grid')
    page.screenshot(path="jules-scratch/verification/homepage.png")

    # Navigate to the register page and register a new user
    page.get_by_role("link", name="Register").click()
    expect(page).to_have_url("http://localhost:5173/register")
    page.get_by_label("Email").fill("testuser@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Register").click()

    # Navigate to the login page and log in
    page.wait_for_url("http://localhost:5173/login")
    page.get_by_label("Email").fill("testuser@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # Wait for the home page to load after login
    page.wait_for_url("http://localhost:5173/")
    expect(page.get_by_role("button", name="Logout")).to_be_visible()

    # Add a product to the cart
    page.locator('.grid > div').first.get_by_role('button', name='Add to Cart').click()

    # Navigate to the cart page and take a screenshot
    page.get_by_role("link", name="Cart").click()
    page.wait_for_url("http://localhost:5173/cart")
    page.wait_for_selector('.container')
    page.screenshot(path="jules-scratch/verification/cart.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
