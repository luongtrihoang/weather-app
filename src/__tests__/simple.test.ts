describe('Simple Test', () => {
  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should have environment variables set', () => {
    expect(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY).toBe('test_api_key')
  })
}) 