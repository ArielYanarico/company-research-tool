import { BadRequestException } from "@nestjs/common/exceptions";

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

  for (const [index, providerResult] of providerResults.entries()) {
    const { name } = providerRequests[index];

    if (providerResult.status === 'fulfilled') {
      result[name] = providerResult.value;
    } else {
      partialError[name] = getErrorMessage(providerResult.reason);
    }
  }

  console.log('Partial errors:', result);
  if (Object.keys(result).length === 0) {
    throw new BadRequestException(
      'Company not found in any of the providers.'
    );
  }

  return Object.keys(partialError).length > 0
    ? { ...result, partialError }
    : result;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
