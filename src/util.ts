const publication = {
    "swufe": "西南财经大学",
    "cufe":
}

interface PublicationInfo {
    publicationName: string;
    rank: string;
}

export function splitDictToList(inputDict: Map<string, string>): PublicationInfo[] {
    const result: PublicationInfo[] = [];
    for (const key in inputDict) {
      if (Object.prototype.hasOwnProperty.call(inputDict, key)) {
        const publicationInfo: PublicationInfo = {
          publicationName: key,
          rank: inputDict[key],
        };
        result.push(publicationInfo);
      }
    }
    return result;
  }