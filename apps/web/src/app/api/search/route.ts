import { NextRequest, NextResponse } from 'next/server'
import type { SearchFilters, ApiResponse, SearchResult } from '@scienceviddb/shared'

/**
 * Search API route - Edge-friendly for fast responses
 * 
 * TODO: Implement hybrid search (lexical + semantic rerank)
 * - Query search index for keyword/faceted results
 * - Optionally rerank with vector DB for semantic similarity
 * - Combine results and return
 */
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const discipline = searchParams.get('discipline')
  
  // TODO: Implement actual search logic
  // For now, return stubbed response
  const response: ApiResponse<SearchResult[]> = {
    data: [],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    },
  }

  return NextResponse.json(response)
}

