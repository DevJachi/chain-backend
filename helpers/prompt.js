import prompt from "prompt";
const schema = {
  properties: {
    privateKey: {
      message: "Enter Private Key",
      required: true,
      hidden: true,
    },
  },
};

export const promptForKey = async () => {
  prompt.start();
  const result = await prompt.get(schema);
  return result.privateKey;
};
