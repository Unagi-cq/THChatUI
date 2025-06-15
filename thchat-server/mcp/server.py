from mcp.server.fastmcp import FastMCP

mcp = FastMCP(name="Weather")


@mcp.tool()
async def get_weather(location: str) -> str:
    """获取位置的天气。"""
    return "纽约总是阳光明媚"


if __name__ == "__main__":
    mcp.run(transport="streamable-http")