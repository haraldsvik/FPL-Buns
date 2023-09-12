export const fetchFPL = async (url: string) => {
  try {
    const res = await fetch(url, { headers: { "User-Agent": "" } });

    if (!res.ok) {
      throw new Error("Failed fetching FPL data.");
    }

    return await res.json();
  } catch (error) {
    console.error("FPL error", error);
    throw error;
  }
};