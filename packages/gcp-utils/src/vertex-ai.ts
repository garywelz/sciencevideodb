/**
 * Vertex AI integration
 * 
 * Used for generating embeddings using Vertex AI models.
 * Alternative to OpenAI for embedding generation.
 */

import { PredictionServiceClient } from '@google-cloud/aiplatform'
import { helpers } from '@google-cloud/aiplatform'

const PROJECT_ID = 'regal-scholar-453620-r7'
const LOCATION = 'us-central1' // Adjust location as needed
const client = new PredictionServiceClient({
  apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
})

/**
 * Generate text embeddings using Vertex AI
 * 
 * @param texts - Array of text strings to embed
 * @param model - Model name (default: textembedding-gecko@003)
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(
  texts: string[],
  model: string = 'textembedding-gecko@003'
): Promise<number[][]> {
  const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${model}`
  
  const instances = texts.map((text) => ({
    content: text,
  }))
  
  const request = {
    endpoint,
    instances: instances.map((instance) => helpers.toValue(instance) as Record<string, unknown>),
  }
  
    try {
      const [response] = await client.predict(request)
      
      if (!response.predictions) {
        throw new Error('No predictions returned from Vertex AI')
      }
      
      const embeddings = response.predictions.map((prediction) => {
        // Convert prediction to a plain object to extract embeddings
        const predictionValue = helpers.toValue(prediction)
        const embeddingData = predictionValue as Record<string, unknown>
        
        // Extract embeddings from the prediction structure
        // Vertex AI returns embeddings in a nested structure
        if (embeddingData && typeof embeddingData === 'object') {
          const embeddingsObj = (embeddingData as { embeddings?: { values?: number[] } }).embeddings
          return embeddingsObj?.values || []
        }
        
        return []
      })
      
      return embeddings
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    throw new Error(`Failed to generate embeddings: ${errorMessage}`)
  }
}

/**
 * Generate a single embedding for a text string
 * 
 * @param text - Text string to embed
 * @param model - Model name (default: textembedding-gecko@003)
 * @returns Embedding vector
 */
export async function generateEmbedding(
  text: string,
  model: string = 'textembedding-gecko@003'
): Promise<number[]> {
  const embeddings = await generateEmbeddings([text], model)
  return embeddings[0] || []
}

