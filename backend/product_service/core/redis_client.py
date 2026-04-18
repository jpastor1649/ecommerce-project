"""Redis client placeholder for compatibility with existing lifecycle hooks."""


async def close_redis_connection() -> None:
    """No-op cleanup to preserve existing shutdown flow."""
    return None
