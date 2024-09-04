const self = this;

self.onmessage = function(e) {
    const data = e.data;
    const result = parseSerializedData(data);
    self.postMessage(result);
  };
  
  function parseSerializedData(data) {
    try {
      if (!data) return [];

      const serializedMatch = data.match(/s:\d+:"(\[.*\])";/);
      const jsonMatch = data.match(/s:\d+:"({.*})";/);
  
      if (serializedMatch) {
        const jsonString = serializedMatch[1];
        return JSON.parse(jsonString);
      } else if (jsonMatch) {
        const jsonString = jsonMatch[1];
        return JSON.parse(jsonString);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      return { error: 'Failed to parse data' };
    }
}
  