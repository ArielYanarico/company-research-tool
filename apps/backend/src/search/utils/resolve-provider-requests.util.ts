export type ProviderRequest = {
  name: string;
  request: Promise<unknown>;
};

export async function resolveProviderRequests(
  providerRequests: ProviderRequest[],
): Promise<Record<string, unknown>> {
  const providerResults = await Promise.allSettled(
    providerRequests.map(({ request }) => request),
  );
  const partialError: Record<string, string> = {};
  const result: Record<string, unknown> = {};
  let firstError: unknown;

  for (const [index, providerResult] of providerResults.entries()) {
    const { name } = providerRequests[index];

    if (providerResult.status === 'fulfilled') {
      result[name] = providerResult.value;
    } else {
      firstError ??= providerResult.reason;
      partialError[name] = getErrorMessage(providerResult.reason);
    }
  }

  if (Object.keys(result).length === 0) {
    throw firstError;
  }

  return Object.keys(partialError).length > 0
    ? { ...result, partialError }
    : result;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
