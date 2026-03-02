const DIRECT_CONVERSATION_PREFIX = "pair_";

export const buildDirectConversationId = (
  patientId: string,
  psychologistId: string
) => `${DIRECT_CONVERSATION_PREFIX}${patientId}_${psychologistId}`;

export const parseDirectConversationId = (
  value: string
): { patientId: string; psychologistId: string } | null => {
  if (!value.startsWith(DIRECT_CONVERSATION_PREFIX)) return null;
  const raw = value.slice(DIRECT_CONVERSATION_PREFIX.length);
  const [patientId, psychologistId] = raw.split("_");
  if (!patientId || !psychologistId) return null;
  return { patientId, psychologistId };
};
